## How to Setup 🛠️
1. Clone the frontend and backend repo to your local machine.
2. Use `npm run dev` on both repos to run them locally. Both should have support for hot reload out of the box.

## Introduction (TBD)
...
Link to frontend repo: 	[Raisekit frontend](https://github.com/Raisekit/raisekit-frontend)
...

## Threat Modeling 🛡️
### External Dependencies
| ID | Description | 
| ----------- | ----------- |
| 1 | Raisekit backend will run on [GCP](https://cloud.google.com/docs/security/infrastructure/design) which offers network security like firewalls and network segmentation, Identity and access management, DDos protection, etc. |
| 2 | Frontend and database is host on [Firebase](https://firebase.google.com/docs/rules). Firebase also provides security measures. |
| 3 | Backend and database connect over public internet. |
| 4 | GCP use Internet Protocol Security (IPsec) protocol on Network layer, TLS protocol on Transport layer and HTTPs, SMTP, TLS on Application layer. |

### Data Flow Diagram
![dfd](./Threat_model_DFD.png)
