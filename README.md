# reactjs-elasticsearch
Using reactjs to add current browser user-agent infos into elasticsearch

#Pre-requis :

Install node 

Intall ElasticSeach version 6.3.+

#To run this example :

Checkout out the projet or clone it.

Move to  reactjs-elasticsearch folder

Run npm install

Run npm start

#To avoid cors origin  problems add  the following lines inside elasticsearch.yml

http.cors.enabled: true

http.cors.allow-origin: "*"

http.cors.allow-methods: OPTIONS, HEAD, GET, POST, PUT, DELETE

http.cors.allow-headers: "X-Requested-With, Content-Type, Content-Length, X-User"

action.auto_create_index: true
