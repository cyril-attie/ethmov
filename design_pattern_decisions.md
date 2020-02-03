# Design Patterns 

The contract stores transports structs containing initial transport demand properties in a mapping until delivery. Once delivered the transport struct properties are deleted. 

Each transport demand has a transport identifier. This identifier is also used in the mapping that stores an array of supply offers containing the properties of the supply, the transporter and the ask price.

Finally a counter keeps track of the number of transports demanded in order to generate new transport identifiers. 

Beyond the basic structure some additional features could have been added:
- a mechanism to delete transports having reached their delivery deadline without being delivered. 
- a way to modify transport structs
- profile pages with records
- the possibility of passing a observation/review message on every event (pick up, delivery...etc)
- the possibility for transporter to eventually provide insurance on pickedup packets 

The tests check that a user can create and delete transport demands and supplies as these are the most essential features. 

The app is minimalistic. It only allows to create transport demands.


