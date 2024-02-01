var express = require('express');
var { KB } = require('../models/kb_setting');
var router = express.Router();
var winston = require('../config/winston');
const openaiService = require('../services/openaiService');


router.get('/', async (req, res) => {

    let project_id = req.projectid;

    KB.find({ id_project: project_id }, (err, kbs) => {
        if (err) {
            winston.error("Find all kbs error: ", err);
            return res.status(500).send({ success: false, error: err });
        }

        winston.debug("KBs found: ", kbs);
        return res.status(200).send(kbs);
    })
})

router.get('/:kb_id', async (req, res) => {

    let kb_id = req.params.kb_id;

    KB.findById(kb_id, (err, kb) => {
        if (err) {
            winston.error("Find kb by id error: ", err);
            return res.status(500).send({ success: false, error: err });
        }

        return res.status(200).send(kb);
    })
})

router.post('/', async (req, res) => {


    let project_id = req.projectid;
    let body = req.body;
    console.log("create new kb project_id " + project_id);
    console.log("create new kb body ", body);

    let new_kb = {
        id_project: project_id,
        name: body.name,
        type: body.type,
        source: body.source,
        content: body.content,
        namespace: body.namespace
    }
    if (!new_kb.namespace) {
        new_kb.namespace = project_id;
    }
    winston.debug("adding kb: ", new_kb);


    KB.findOneAndUpdate({ type: 'url', source: new_kb.source }, new_kb, { upsert: true, new: true, rawResult: true }, async (err, raw) => {
        if (err) {
            winston.error("findOneAndUpdate with upsert error: ", err);
            res.status(500).send({ success: false, error: err });
        }
        else {

            res.status(200).send(raw);

            startScrape(raw.value).then((response) => {
                winston.verbose("startScrape response: ", response);
            }).catch((err) => {
                winston.error("startScrape err: ", err);
            })

        }
    })

})

router.put('/:kb_id', async (req, res) => {

    let kb_id = req.params.kb_id;
    winston.verbose("update kb_id " + kb_id);

    let update = {};

    if (req.body.name != undefined) {
        update.name = req.body.name;
    }

    if (req.body.status != undefined) {
        update.status = req.body.status;
    }

    update.updatedAt = new Date();
    winston.debug("kb update: ", update);

    KB.findByIdAndUpdate(kb_id, update, { new: true }, (err, savedKb) => {

        if (err) {
            winston.error("KB findByIdAndUpdate error: ", err);
            return res.status(500).send({ success: false, error: err });
        }

        if (!savedKb) {
            winston.debug("Try to updating a non-existing kb");
            return res.status(400).send({ success: false, message: "Content not found" })
        }

        res.status(200).send(savedKb)
    })

})


// PROXY PUGLIA AI V2 - START
router.post('/scrape/single', async (req, res) => {

    let data = req.body;
    winston.debug("/scrape/single data: ", data);

    KB.findById(data.id, (err, kb) => {
        if (err) {
            winston.error("findById error: ", err);
            return res.status(500).send({ success: false, error: err });
        }

        else if (!kb) {
            return res.status(404).send({ success: false, error: "Unable to find the kb requested" })
        }
        else {

            let json = {
                id: kb._id,
                type: kb.type,
                source: kb.source,
                content: kb.content,
                namespace: kb.namespace
            }

            startScrape(json).then((response) => {
                winston.verbose("startScrape response: ", response);
                res.status(200).send(response);
            }).catch((err) => {
                winston.error("startScrape err: ", err);
                res.status(500).send({ success: false, error: err });
            })

        }
    })

})

router.post('/scrape/status', async (req, res) => {

    let data = req.body;
    winston.debug("/scrapeStatus req.body: ", req.body);

    let returnObject = false;

    if (req.query &&
        req.query.returnObject &&
        (req.query.returnObject === true || req.query.returnObject === true)) {
        returnObject = true;
    }

    openaiService.scrapeStatus(data).then((response) => {

        winston.debug("scrapeStatus response.data: ", response.data);

        let update = {};

        if (response.data.status_code) {
            update.status = response.data.status_code;
        }

        KB.findByIdAndUpdate(data.id, update, { new: true }, (err, savedKb) => {

            if (err) {
                winston.verbose("Status was successfully recovered, but the update on the db failed");

                if (returnObject) {
                    return res.status(206).send({ warning: "Unable to udpate content on db", message: "The original reply was forwarded", data: response.data });
                } else {
                    return res.status(200).send(response.data);
                }
            }

            if (returnObject) {
                return res.status(200).send(savedKb);
            } else {
                return res.status(200).send(response.data);
            }
        })

    }).catch((err) => {
        winston.error("scrapeStatus err: ", err);
        let status = err.response.status;
        res.status(status).send({ statusText: err.response.statusText, detail: err.response.data.detail });
    })
})

router.post('/qa', async (req, res) => {
    let data = req.body;
    winston.debug("/qa data: ", data);

    if (!data.gptkey) {
        let gptkey = process.env.GPTKEY;
        if (!gptkey) {
            return res.status(403).send({ success: false, error: "GPT apikey undefined" })
        }
        data.gptkey = gptkey;
    }

    openaiService.askNamespace(data).then((resp) => {
        winston.debug("qa resp: ", resp.data);
        res.status(200).send(resp.data);
    }).catch((err) => {
        winston.error("qa err: ", err);
        let status = err.response.status;
        res.status(status).send({ statusText: err.response.statusText, detail: err.response.data.detail });
    })
})

router.delete('/delete', async (req, res) => {

    let data = req.body;
    winston.debug("/delete data: ", data);

    openaiService.deleteIndex(data).then((resp) => {
        winston.debug("delete resp: ", resp.data);
        res.status(200).send(resp.data);
    }).catch((err) => {
        winston.error("delete err: ", err);
        let status = err.response.status;
        res.status(status).send({ statusText: err.response.statusText, detail: err.response.data.detail });
    })

})

router.delete('/deleteall', async (req, res) => {

    let data = req.body;
    winston.debug('/delete all data: ', data);

    openaiService.deleteNamespace(data).then((resp) => {
        winston.debug("delete namespace resp: ", resp.data);
        res.status(200).send(resp.data);
    }).catch((err) => {
        winston.error("delete namespace err: ", err);
        let status = err.response.status;
        res.status(status).send({ statusText: err.response.statusText, detail: err.response.data.detail });
    })
})
// PROXY PUGLIA AI V2 - END

router.delete('/:kb_id', async (req, res) => {

    let project_id = req.projectid;
    let kb_id = req.params.kb_id;
    winston.verbose("delete kb_id " + kb_id);

    let data = {
        id: kb_id,
        namespace: project_id
    }

    openaiService.deleteIndex(data).then((resp) => {
        winston.debug("delete resp: ", resp.data);

        if (resp.data.success === true) {
            KB.findByIdAndDelete(kb_id, (err, deletedKb) => {

                if (err) {
                    winston.error("Delete kb error: ", err);
                    return res.status(500).send({ success: false, error: err });
                }
                res.status(200).send(deletedKb);
            })

        } else {
            winston.info("resp.data: ", resp.data);

            KB.findOneAndDelete({ _id: kb_id, status: { $in: [-1, 3, 4] } }, (err, deletedKb) => {
                if (err) {
                    winston.error("findOneAndDelete err: ", err);
                    return res.status(500).send({ success: false, error: "Unable to delete the content due to an error" })
                }
                else if (!deletedKb) {
                    winston.verbose("Unable to delete the content in indexing status")
                    return res.status(500).send({ success: false, error: "Unable to delete the content in indexing status" })
                } else {
                    res.status(200).send(deletedKb);
                }
            })
        }

    }).catch((err) => {
        let status = err.response.status;
        res.status(status).send({ statusText: err.response.statusText, detail: err.response.data.detail });
    })

})

async function updateStatus(id, status) {
    return new Promise((resolve) => {

        KB.findByIdAndUpdate(id, { status: status }, (err, updatedKb) => {
            if (err) {
                resolve(false)
            } else {
                winston.debug("updatedKb: ", updatedKb)
                resolve(true);
            }
        })
    })
}

async function startScrape(data) {

    if (!data.gptkey) {
        let gptkey = process.env.GPTKEY;
        if (!gptkey) {
            return { error: "GPT apikey undefined" }
        }
        data.gptkey = gptkey;
    }

    return new Promise((resolve, reject) => {
        openaiService.singleScrape(data).then(async (resp) => {
            winston.debug("singleScrape resp: ", resp.data);
            let status_updated = await updateStatus(data.id, 0);
            winston.verbose("status of kb " + data.id + " updated: " + status_updated);
            resolve(resp.data);
        }).catch((err) => {
            winston.error("singleScrape err: ", err);
            reject(err);
        })
    })
}

module.exports = router;