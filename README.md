# Raisekit
## What is Raisekit?

Raisekit is a web application that aims to streamline fundraising for founders by automating the manual processes involved. Currently, Raisekit is focused on automating fundraising metrics and data rooms. Founders can upload their sales, costs and cash data to automatically calculate the most popular metrics for fundraising.

## Backend Architecture and Tech Stack

The backend of Raisekit is a NodeJS server built with Fastify. It utilizes Cloud Firestore as a database. It's containerized via Docker and deployed on a Google Cloud Run container via Cloud Build.

## Raisekit Cloud Architecture

![raisekitcloudarch](https://user-images.githubusercontent.com/93583929/234055558-58593311-012f-4276-a70d-e06f29ee52f7.png)

## Raisekit CI/CD Pipeline

![raisekitcicd](https://user-images.githubusercontent.com/93583929/234055523-7af0901a-f840-44ca-9548-cbc33223ec6c.png)

## Develop locally
Follow the instructions below to set up a local development environment for Raisekit.

1. Clone the repository
```
git clone https://github.com/Raisekit/raisekit-frontend.git
```
2. Copy the .env file, the docker-compose file and the service account credentials into the repository
```
cp /path/to/.env raisekit-backend && cp /path/to/serviceAccountCreds.json raisekit-backend && cp /path/to/docker-compose.yml raisekit-backend
```
3. Install the required dependencies
```
npm install
```
4. Run the application locally
```
npm run dev
```
5. Alternatively run the application with Docker (You should have [Docker installed](https://docs.docker.com/get-docker/) in this case)
```
docker compose up --build
```
## Raisekit in production
You can use Raisekit in production at https://app.raisekit.io



## Security - Threat Modeling 🛡️
### External Dependencies
| ID | Description | 
| ----------- | ----------- |
| 1 | Raisekit backend will run on [GCP](https://cloud.google.com/docs/security/infrastructure/design) which offers network security like firewalls and network segmentation, Identity and access management, DDos protection, etc. |
| 2 | Frontend and database is host on [Firebase](https://firebase.google.com/docs/rules). Firebase provides security measures such as: Authentication, App Check (verifies that requests come from the app and are made by a genuine user), Cloud Storage Security Rules that enables control over access to files. Also Realtime Database Security Rules to specify who can read, write and update data based on defined conditions. And Security Monitoring tools to detect, identify and respond to security events in the application. |
| 3 | Backend and database connect over public internet. |
| 4 | GCP use Internet Protocol Security (IPsec) protocol on Network layer, TLS protocol on Transport layer and HTTPs, SMTP, TLS on Application layer. |


Link to frontend repo: 	[Raisekit frontend](https://github.com/Raisekit/raisekit-frontend)

### Data Flow Diagram
![dfd](./Threat_model_DFD.png)


### Cyber Security Implemented Measures

|Entry Points|Threats|Mitigation|Implementation|
| ----------- | ----------- | ----------- | ----------- |
|**Authentication**|XSS attacks|HTML sanitization in user input login fields using [DOMPurify](https://www.npmjs.com/package/dompurify) library.||
|||Encode user input with [he](https://www.npmjs.com/package/he) library.||
|||Sanitization with [xss](https://www.npmjs.com/package/xss) library. Another sanitizer for potentially untrusted HTML.||
|**CSV file upload**|Malicious file upload|Check the uploaded file's MIME type|[commit-545aebe](https://github.com/Raisekit/raisekit-frontend/commit/545aebec23b6b4aad05909646d3c28d14047fb44) (done by Sijia)|
|||Reject files with multiple extensions or unexpected extensions|[commit-97a1669](https://github.com/Raisekit/raisekit-frontend/commit/97a16696af1f8549d0f0605e4702ac16c5166260) (done by Sijia)|
||CSV injection|Validate and sanitize input: use [validator](https://www.npmjs.com/package/validator), a sanitization library to escape any potentially harmful characters or strings within the input data|[commit-7bcd524](https://github.com/Raisekit/raisekit-backend/commit/7bcd5240de4b884fedf77ea85dacba412671dcee) (done by Sijia)|
||DoS attacks|Limit the file size|[commit-ec237fa](https://github.com/Raisekit/raisekit-frontend/commit/ec237faf9c75d57c8899d74dbbee757019c6dc0f) (done by Berk)|
|||Set timeouts for uploading CSV files|[commit-9b39235](https://github.com/Raisekit/raisekit-frontend/pull/22/commits/9b392350cdeee2a07166830ea45c8feb7a4818d4) (done by Sijia)|
||Leverage of privilege|Only allow authorized user to upload|[commit-f16b23e](https://github.com/Raisekit/raisekit-backend/commit/f16b23edb5f8165813e0a83641ff344b33331099) (done by Kerem)|



### Next steps
