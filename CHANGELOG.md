

# 2.3.1
- changed tiledesk logo for emails
- open modules: analytics, activity log, multi tenancy, departments, groups, canned responses, tags, triggers, webhooks

# 2.2.39
- Added enterprise module
- Log fix
- Added DISABLE_MONGO_PASSWORD_MASK env variable
- Embedded rasa  proxy
- Added Swedish, Uzbek and Kazakh languages
- Added Azerbaijani language

# 2.2.38  
- Unlocked departments, groups, multi-tenant, tags and canned resposes modules

# 2.2.37  -> PROD 
- skip subtype private message for notification

# 2.2.36
- Ukraine translations

# 2.2.35 
- BugFix projection for /me service

# 2.2.34  
- Added transcript webpage for users without system messages

# 2.2.33
- Request fulltext sort fix

# 2.2.32
- Added Arabic language for the widget
- Updated dependencies with npm update
- Filter requests by lead email

# 2.2.31 (compatible with: Dashboard 2.2.37, Widget 5.0.25)
- Fix email template reading from project.
- Fix export messages to csv
- Fix ip address resolver
- Exclude poweredBy field from widget endpoint
- Bugfix when a conversation has a first_text with \agent
- Added rasa chatbot chatbot type
- Added visitor email and fullname in the fulltext index 

# 2.2.30
- Log fix

# 2.2.29 
- Added endpoint to find requests created by users and guests
- Log fix

# 2.2.28 (compatible with dasboard ver. 2.2.36)
- Operator.select returns context object that contains the temp request
- Added Serbian language to the widget
- Added tag field to the project_user
- Removed default BCC from email
- BugFix: Avoid cluster concurrent jobs in multiple nodes
- Faq template now support blank and example
- Organizzation support added
- ipFilter related to the project is now supported
- Added filter channel name for the request
- Added edit card for payment
- Fix concierge concierge bot for department selection
- Added filter to find a request by ticket_id
- Added filter to snap_lead_lead_id for request
- Added endpoint to close a request by guest


# 2.2.26 (compatible with dasboard ver. 2.2.35)
- Tag fix for 2.2.25

# 2.2.25
- New label prechat form
- Updated mongodb-runner from 4.8.1 to 4.8.3 to fix ssh key error

# 2.2.24 
- webhook subscription can fetch temmates endpoint
- Added hasBot and createdAt index to the request model

# 2.2.23 
- Increased list answers limit from 1000 to 3000

# 2.2.22
- Increased list answers limit from 300 to 1000

# 2.2.21 
- Increased list answers limit from 100 to 300
- enabled again waiting time in widgets endpoint unused


# 2.2.20
- disabled waiting time in widgets endpoint unused

# 2.2.18
- Router logger module enable with ROUTELOGGER_ENABLED=true

# 2.2.17
- Removed default fallback limit on parse reply

# 2.2.16 
- Email templates endpoint
- Created request.updated event for request event and deprecated request.update.comment
- Added Handlebars template processor for the message transformer module only if message.attributes.templateProcessor=true
- Email test send endpoint
- Bugfix widget label
- Added /intents alias for /faq endpoint
- The request_id field of the request model has now a unique index

# 2.2.15
- Added catch messageService.send for bot
- Added external searcher for bot( ex. Rasa proxy) 
- Faq language fix taken from bot language for create single and import from csv
- Lower case reset password fix
- Added alias /bots for /faq_kb

# 2.2.14
- Fix Tiledesk Queue 1.1.11 with authEvent.queueEnabled = true 

# 2.2.13
- Send message validation with empty text

# 2.2.12
- Add /bot endpoint
- Bot and subscription can manage bots

# 2.2.11 
- Logfix

# 2.2.10
- Native mqtt auth fix

# 2.2.8
- Public trigger module

# 2.2.6
- Quota license fix

# 2.2.4  -> PROD
- email invitation fix

# 2.2.3
- Email inboud fix (others disabled and inboudDomain variable fix and token query string encode fix)

# 2.2.2
- log fix

# 2.2.1
- log fix

# 2.2.0
- Cache circleci fix
- Added EMAIL_REPLY_ENABLED and EMAIL_INBOUND_DOMAIN env parameters.
- Added API_URL env variable TODO use wehbook url the same as API_URL if not differnet

# 2.1.42 (Compatible with tiledesk-dashboard 2.2.X)


- Added ticket_id sequence field to the request model
- Routing round robin fix (Also in 2.1.40.1)
- GLOBAL_SECRET env variable fix (Also in 2.1.40.4)
- Chatbot now support blocked_intent
- BugFix route request to another department with the same agents (Also in 2.1.40.1)
- Renamed the chatbot webhook payload field from faq to intent
- Updated tiledesk-chat-util to 0.8.21  (Also in 2.1.40.1)
- Removed request first_text replace new line with empty string (for ticketing)

- Fix login problem when email contains upper case char
- Removed answer field from the fulltext search of the faqs (2.1.40.3)

- Stripe fix for adding new agents (2.1.40.13)
- Added request delete endpoint by id (Also in 2.1.40.15)
- Campaigns direct and for group (Also in 2.1.40.16)

- Csv request export added tags (2.1.40.14)
- Changed request_id to the new standard: support-group-<project_id>-<uid>
- Added tag to the department model
- Bugfix first message with an image fix and touchText limited to 30 character or subject (2.1.40.3)
- Fix request create if department id is not correct
- MessageRoot endpoint also for group messages (Also in 2.1.40.16)
- c21 handler group mesages support (Also in 2.1.40.16)
- Added recipientFullname field to message model. Added save method to messageServive (Also in 2.1.40.16)
- ChatBot webhook fix when the webhook returns also attributes 
- Messages export csv supported
- Request util to lookup id_project from request_id (2.1.40.24)

- Find user id from user email endpoint (also in 2.1.40.21)
- Inizialize enterprise modules before public modules
- Request Notification fix loading snapshot agents (also in 2.1.40.22)
- Config secret fix from env (also in 2.1.40.22)
- Lic ck for users (also in 2.1.40.26)
- Added s_ticketing_taking_01 trigger
- Added email template from project settings
- Faq pagination support
- For Ticketing send to the cc(s) the agent replies 
- \agent now is hidden
- added \close faq
- \close now is hidden
- set custom role in custom auth using signInWithCustomToken
- Chat21 contacts find for agent logged with custom auth 
- Added language field to faq_kb and used to specify the language for faq full-text query (default en)
- Added request priority field
- Concierge bot fix to reroute only for temp conversation without a bot. Race condition issue when you try manually route a request for example inside a chatbot webhook (Also in 2.1.40.31)
- Added webhook_enabled parameter to the faqService create method and test refactor
- Added SYNC_JOIN_LEAVE_GROUP_EVENT environment variable to enable sync between Chat21 (join and leave) and Tiledesk. Default is false. (Also in 2.1.40.32 )
- Added ALLOW_REOPEN_CHAT environment variable to reopen a chat if a user write after a chat is closed  
- Used message.received instead message.create in the messageActionsInterceptor to fix race condition sometime occurs with \close message sent by the bot      
- Please type your reply above this line Only if replyTo is specified
- Webhook origin header fix for webhook


## Email inbound
- EmailService supports custom email config with custom SMTP server settings and custom from email
- Added Tiledesk customer header in the outbound email
- Added Message-ID and sender (message sender fullname) on the outbound email 
- Added project object to sendRequestTranscript function
- Welcome label fix key
- Seamless source page fix

# 2.1.41 
- remove duplicate request script with: 1619185894304-request-remove-duplicated-request-by-request_id--autosync.js
- requestNotification improvement not sending email with empty email field
- Enabled witb DISABLE_SEND_OFFLINE_EMAIL the seamless conversation with email
- signinWithCustomToken endpoint of the auth router now support id_project body parameter for jwt with generic https://www.tiledesk.com audience field (used by tiledesk-smtp-server)
- files download endpoint
- emailService added EMAIL_REPLY_TO parameter;
- Added email notification for new message and new request for email and form channel (ticket) 
- Added microLanguageTransformationInterceptor enabled when message.attributes.microlanguage==true

# 2.1.40.35
- Quota license fix

# 2.1.40.34
- logfix

# 2.1.40.33

- Added setTimeout to resolve race condition for \close event returned by bot 

# 2.1.40.32
- Added SYNC_JOIN_LEAVE_GROUP_EVENT environment variable to enable sync between Chat21 (join and leave) and Tiledesk. Default is false. 

# 2.1.40.31
- Concierge bot fix to reroute only for temp conversation without a bot. Race condition issue when you try manually route a request for example inside a chatbot webhook 

# 2.1.40.30
- logfix

# 2.1.40.29
- --production for npm install within Docker for Enterprise

# 2.1.40.28
- --production for npm install within Docker

# 2.1.40.27
- Added language field to faq_kb and used to specify the language for faq full-text query 

# 2.1.40.26
- Lic ck bug fix for users

# 2.1.40.25 
- microLanguageTransformerInterceptor startup error. It is disabled. Module not present

# 2.1.40.24
- emailService toJSON is not a function fix

# 2.1.40.23
- requestNotification fix and requestUtilRoot lookup endpoint added

# 2.1.40.22
- Inizialize enterprise modules before public modules
- Request Notification fix loading snapshot agents

# 2.1.40.21
- Find user id from user email endpoint

# 2.1.40.20
- MessageRoot endpoint validation fix

# 2.1.40.19 
- Stripe fix with version 1.1.5

# 2.1.40.18
- Messages export csv supported

# 2.1.40.17
- Stripe restored to the previous version 1.1.3

# 2.1.40.16
- added message recipientfullname field to the message entity  to support chat campaigns for direct and group 

# 2.1.40.15
- tag fix

# 2.1.40.14
- requet CSV export fix

# 2.1.40.13 
- Stripe fix for adding new agents

# 2.1.40.12
- Docker image number fix 

# 2.1.40.11
- Docker image number fix 

# 2.1.40.10 
- Docker image number fix 

# 2.1.40.9 
- Added request delete endpoint by id

# 2.1.40.7
- logfix

# 2.1.40.6
- Fix request create if department id is not correct

# 2.1.40.5
- Logfix

# 2.1.40.4
- GLOBAL_SECRET env variable fix

# 2.1.40.3 
- Bugfix first message with an image fix and touchText limited to 30 character or subject
- Removed answer field from the fulltext search of the faqs


# 2.1.40.2 
- log fix

# 2.1.40.1
- Routing round robin fix
- Updated tiledesk-chat-util to 0.8.21
- BugFix route request to another department with the same agents


# 2.1.40
- webhook fix for return empty body
- log fix
- Added hasbot filter for GET requests endpoint

# 2.1.39
- Log fix
- Chat21 presence  webhook error handler fix 

# 2.1.38 -> TILEDESK DASHBOARD v2.1.49.1
- Added PUT /images/users endpoint where you can archive user's image at the root level of the path
- Added DELETE /images/users endpoint to delete an image
- Added PUT /images/users/photo endpoint where you can archive user's avatar at the root level of the path
- Root messages endpoint fixed
- Now RestHook module is public
- Minor deps update

# 2.1.37 

- Trigger module moved to public npm
- Websocket Message limit with environment variable WS_HISTORY_MESSAGES_LIMIT (300 default)
- Chat21Webhook now support then new event_type with values "conversation-archived" and the old "deleted-conversation" (back compatibility). The field recipient_id is renamed to convers_with, but maintained for back compatibility. The project_id is taken from the support-group but also from conversation.attributes for back compatibility.
- Chat21 group sync now create group with group- prefix. If old group exists (before group- prefix) group updating and deleting can create a duplicate entries
- Fix intent_info object for is_fallback false
- Updated dependencies
- Updated snapshot.lead when a lead is updated. Editing a lead requires to refresh the realtime conversation panel.
- Lead PUT endpoint fix for status field
- Websocket error fix when MongoDB is < 4.XX catch snapshot exception
- Added request.attributes.abandoned_by_project_users when a user leave a chat
- Send messages direct endpoint
- Create project_user endpoint by agent (Ticketing) now is with Guest Role
- Bot webhook error now return the standard message and not the error 
- Added WEBHOOK_ORIGIN env variable for each webhook calls


# 2.1.36
- Minor log fix 

# 2.1.35
- Minor ws log fix 

# 2.1.34
- Minor ws log fix 

# 2.1.33
- Disabled sendUser email for requestNotification

# 2.1.32
- Project_user endpoint (/get) now can be obtained by uuid_user field
- Added intent_info to message.attributes sent from bot
- Pending invite email lowercase fix
- Project_user invite email lowercase fix
- Widget endpoint fix for not found project 
- Chat21 WebHook now support also "message-sent" event_type value

# 2.1.31
- Log fix

# 2.1.30 (Requires tiledesk-dashboard 2.1.45+)
- Added Pending Invitation db indexes
- The requests queries with status open (!=1000) are not limited for free accounts.   
- Performance improvment moving request.agents (select false) and availableAgentsCount fields into request.snapshot. Updated @tiledesk-ent/tiledesk-server-triggers:1.1.75. Migration scripts: 1616687831941-trigger_availableAgentsCount_to_snapshot_agents--autosync 1616687831941-trigger_availableAgentsCount_to_snapshot_agents-key--autosync 1616685902635-request_agents_to_snapshot_agents--autosync
- Added event index to increase analytics performance 
- Snapshot.department fix for ticketing (Without a selected department)  
- Websocket query is improved (without lead populate and with lean. it's enabled isAuthenticated field of the request.snapshot.requester)
- Added user object to the event emit method to fix decoded_jwt field of the lead and request
- The Request deletion also deletes messages    

# 2.1.21
- BugFix: request availableAgentsCount performance fix

# 2.1.20
- Default faq fix
- Log fix

# 2.1.19
- Default faq with actions example

# 2.1.18
- Added faq intent_display_name and intent_id. Included database migration script: 1615214914082-faq-intent_id-intent_display_name-fields-added--autosync.js
- Now you can filter the requests by snap_department_routing, req.query.snap_department_default, req.query.snap_department_id_bot, snap_department_id_bot_exists 
- BugFix: Parse FAQ form CSV fix
- You can enabled Smart Assignment by default for new project with SMART_ASSIGNMENT_CHAT_LIMIT_ON_DEFAULT_PROJECT=true (default = false)
- Added snapshot object to the request to store embedded snap objects like department, agents, lead, requester.
- Updated repository dependencies
- Websocket teammates update fix
- Now support node 12.x and docker node 12
- Updated chat21 dependencies (firebase, etc.)
- Added project_user creation endpoint for Ticketing (POST)
- Set participants endpoint supports no_populate query param
- Added request /assing endpoint
- Now a request can be assinged directly to a partipant without a department for ticket use case.
- Added Analytics events
- Added leads filter to retrieve only their with email (with_email=true) and with fullname (with_fullname=true)
- Now the bot can find actions answers by intent_display_name and intent_id
- Project_user deletion only for owner

# 2.1.17
- Log fix

# 2.1.16
- CSV export fix

# 2.1.15


- Automatically close unresponsive bot conversation  (also in 2.1.14.4). You may configure CLOSE_BOT_UNRESPONSIVE_REQUESTS_CRON_EXPRESSION, etc.
- Added _answerid field to the messages replies send from the chatbot under attributes field.
- Added fulltext indexes for request.notes request.tags and request.subject.. 
- Added default language field for pivoting. We disabled pre traslation for EN, IT, FR. So only pivot language is taken into account. Included database migration script:  1604082287722-labels-data-default-fields--autosync.js
- Added status field to project_user collection. Included database migration script: 1603797978971-project_users-status-field-added--autosync.js
- Added channel_type (group or direct) and channel (chat21, whatsapp, etc..) fields to the message model. Included database migration script: 1602847963299-message-channel_type-and-channel-fields-added--autosync.js
- Added posfix $reply_time to WAITING_TIME_FOUND label. Included database migration script: 1604082288723-labels-waiting_time-added_suffix_reply_time--autosync.js
- Added channelOutbound (chat21, whatsapp, etc..) fields to indentify the outboud channel to the request model. Included database migration script: 1603955232377-requests-channel-outbound-fields--autosync.js
- Renamed request field UNSERVED (100) to UNASSIGNED (100) and SERVED (200) to ASSIGNED (200)
- Renamed property max_agent_served_chat to max_agent_assigned_chat of the project.settings object.Included database migration script: project-settings-max_agent_assigned_renamed--autosync
- Renamed property max_served_chat to max_assigned_chat of the project_user object. Included database migration script: project_user-max_assigned_chat-renamed--autosync
- SourcePage and bot answer stats with tiledesk-ent/tiledesk-server-analytics: 1.1.9
- Fix Conversation export to CSV
- Bots statistics with tiledesk-ent/tiledesk-server-analytics: 1.1.8
- Added support to channel selection for resthook module @tiledesk-ent/tiledesk-server-resthook: 1.1.47
- Added supervisor role
- BugFix: Updated jwthistory and queue module with listen function fix (also in 2.1.14.1)
- Department patch method added (also in 2.1.14.2)
- BugFix: Now you can signupWithCustomToken using subject=userexternal and subscription type audience (https://tiledesk.com/subscriptions/subid). It's used by Whatsapp and Facebook Messenger apps (also in 2.1.14.2)
- Chat21 contact detail endpoint
- Added tags field for the lead model
- Added location field to the request model. Auto populate location field from ip
- Update all dependencies to last version
- Image endpoint now return also thumbnail filename
- Added analytics endpoint for messages (also in 2.1.14.2)
- New websocket return also events model (beta)
- Log fix for signup and signin endpoint (also in 2.1.14.2)
- Added email notification setting for each teammate (also in 2.1.14.3)
- Added email notification setting for each project
- Bugfix (@tiledesk-ent/tiledesk-server-triggers":1.1.69) for chatbot invitation race condition with Chat21 createGroup and setMembers method. Now the trigger listens to requestEvent.on("request.support_group.created",..) event and not to requestEvent.on("request.create",..) event. This doen't require data migration for old triggers (also in 2.1.14.4).
- Added plugin to save log to MongoDB (also in 2.1.14.4) with WRITE_LOG_TO_MONGODB=true, LOG_MONGODB_LEVEL, DATABASE_LOG_URI
- Added plugin to save multi-tenant log to MongoDB with WRITE_LOG_MT_TO_MONGODB=true, LOG_MT_MONGODB_LEVEL
- Added DEFAULT_FULLTEXT_INDEX_LANGUAGE env parameter for Faq, Lead, message and requests. Before the index language was Italian.
- Added support to \close action
- Disabled send trascript email for autoclosed conversations #413

# 2.1.14.5 -> Cloud Production
- Winston MongoDB Log fix

# 2.1.14.4
- Automatically close unresponsive bot conversation. You may configure CLOSE_BOT_UNRESPONSIVE_REQUESTS_CRON_EXPRESSION, etc.
- Bugfix (@tiledesk-ent/tiledesk-server-triggers":1.1.69) for chatbot invitation race condition with Chat21 createGroup and setMembers method. Now the trigger listens to requestEvent.on("request.support_group.created",..) event and not to requestEvent.on("request.create",..) event. This doen't require data migration for old triggers.
- Added plugin to save log to MongoDB 

# 2.1.14.3
Added email notification setting for each teammate (also in 2.1.14.3)

# 2.1.14.2
- Department patch method added (ok)
- BugFix: Now you can signupWithCustomToken using subject=userexternal and subscription type audience (https://tiledesk.com/subscriptions/subid). It's used by Whatsapp and Facebook Messenger apps . UNISALENTO TEST
- Added analytics endpoint for messages 
- Log fix for signup and signin endpoint.

# 2.1.14.1
- Updated queue module with listen function fix

# 2.1.14
- Renamed field presence.lastOnlineAt to changedAt
- Added filter presencestatus for project_users endpoint
- Websocket events updated with filters

# 2.1.13
- Added Cors options pre-flight with 
- Fix TD218 Audit log for user invitation already registered

# 2.1.12
- Chat21 engine selection with CHAT21_ENGINE=[mqtt|firebase]
- Schema migration tool with mongoose-migrate. Added env property DISABLE_AUTO_SHEMA_MIGRATION
- #TD-250 Added emoji callout
- Cors fix. Removed alternative cors response header.
- Channel manager refactoring
- Event route fix and ws event endpoint
- WS projectì_user endpoint is now usable by other teammate
- Message text required only for type text messages
- #TD-251 Email lower case fix
- Updated Node default engine to 11.15.0
- Added hasBot query filter to retrive conversations with or without a bot
- Chatbot \frame action command supported
- Supported components: tiledesk-dashboard:2.0.73+ chat21-webwidget:4.0.75+ chat21-ionic:2.0.12

# 2.1.11
- Mongo support for Winston with: WRITE_LOG_TO_MONGODB=true 
- Logfix

# 2.1.10
- Tiledesk Chat21 groups syncronizer. Enable with SYNC_CHAT21_GROUPS="true"
- Built-in faq updated  and chatbot webhook example changed
- Return role: admin if the admin sign-in with email and password
- Default fallback event emitting
- Files and images storage services
- Supported components: tiledesk-dashboard:2.0.70 chat21-webwidget:4.0.73 chat21-ionic:2.0.12

# 2.1.9
- Widget departments fix

# 2.1.8
- SigninWithCustomToken fix for different audience types

# 2.1.7
- Minor fix

# 2.1.6 
- Push notification fix for the first support message and for group joining.

# 2.1.5
- Email template externalization with handlebars under /template/email folder. 
 You can override the email template using EMAIL_ASSIGN_REQUEST_HTML_TEMPLATE, EMAIL_POOLED_REQUEST_HTML_TEMPLATE,
 EMAIL_RESET_PASSWORD_HTML_TEMPLATE, EMAIL_PASSWORD_CHANGED_HTML_TEMPLATE, EMAIL_EXUSER_INVITED_HTML_TEMPLATE,
 EMAIL_NEWUSER_INVITED_HTML_TEMPLATE, EMAIL_VERIFY_HTML_TEMPLATE, EMAIL_SEND_TRANSCRIPT_HTML_TEMPLATE env variables

# 2.1.4
- Email config parameters fix

# 2.1.3
- Language pivot fix

# 2.1.2
- License fix

# 2.1.1
- Minor bug fix

# 2.1.0
- Release

# 2.1.0-beta24
- Minor bug fix

# 2.1.0-beta23
- Email fix for pooled request caming from bot

# 2.1.0-beta22 
- filter identity bot. use all=true to get all bot. Require Dashboard 2.0.49
- Chat21 Contacts for web chat recipients list
- Chat21 Presence webhook 
- Widget i8n


# 2.1.0-beta14 # 2.1.0-beta15 # 2.1.0-beta16 # 2.1.0-beta..20
- Docker tag

# 2.1.0-beta13
- add canned responses and tag library
- add groups and departments modules
- cache, routing, resthook deps update
- added request.status all for rest api
- request and lead physical deletion
- add mt and visitor counter modules
- removed reqLog feature
- typing webhook fix
- label fix with no pivoting to default languages
- removed terminus

# 2.1.0-beta12
- Send transcript fix

# 2.1.0-beta11
- Activity archiver fix for preflight request
- request physical deletion

# 2.1.0-beta10
- Minor bugfix for events

# 2.1.0-beta9
- Trigger fix for custom authentication

# 2.1.0-beta7
- Activities, Jwt History and Rest Hook update

# 2.1.0-beta6
- Widget language pivoting fix

# 2.1.0-beta5
- Support for cache
- Removed message_count of request model
- Concierge bot now update lead after preflight

# 2.1.0-beta4
- added isAuthenticated field to project_user model
- trigger update 
- set requester to request create of the chat21 webhook

# 2.1.0-beta2
- added field participantsAgents, participantsBot and hasBot fields. Migration file updated
- request, department, project, project_users, subscription indexes added
- conciergeBot multilanguage improvement
- trigger module updated
- resthook module updated with minor fixes
- added fanout pub sub to queue module and added support for *.queue.pubsub events
- WS_HISTORY_REQUESTS_LIMIT env variable added

# 2.1.0-beta1 
- project rest api order fix by updatedAt
- improved internal bot with defaultFallback and smart text and webhook
- messageService.send with metadata field
- widget and test page route
- Dockerfile fix (removed nano and nodemon)
- invite teammate rest api with available or unavailable 
- welcome message when a request is assigned to an agent (TOUCHING_OPERATOR)
- added department description and bot description fields
- added request rating rest api (PATCH)
- implemented \start command 
- trigger improvement 
- added request status (TEMP=50) and preflight field (exclude request.preflight=true from ws) 
- concierge bot now supports switch from preflight to standard request (rerouting, preflight update, first_text update) 
- added typing event 
- created Message Transformation Engine for multilanguage message (labels with the new labelService) and text templating
- added language field to message model and indexes improvement
- tag and tagLibrary refactoring 
- resigninAnonymously rest api for widget re-authenticate
- email notification improvement for agent joing 
- added label for office closed
- added queue for Enterprise version (websocket)
- Websocket pub/sub fix with handlePublishMessageToClientId
- Websocket performance fix with lean and removing populate 
- Added kubernetes sample config file
- Added required firstname and lastname to signup endpoint
- Removed message.request.messages and message.request.department.bot for message.create event  