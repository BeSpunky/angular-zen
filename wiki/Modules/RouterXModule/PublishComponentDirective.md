The directive automates management of components in [`RouterOutletComponentBus`](/Modules/RouterXModule/RouterOutletComponentBus).  
Outlets marked with `publishComponent` will publish and unpublish components automatically to the bus.

# Component Manangement Flow
`PublishComponentDirective` reads the name of the outlet, then listens to the outlet's `activate` and `deactivate` events.

When the outlet activates a component, the directive publishes it to the bus service along with the outlet's name.  
When the outlet deactivates a component, the directive publishes a `null` value along with the outlet's name.  

When the outlet is destroyed (i.e. removed from the DOM), the directive unpublishes the component from the bus service.

# How to use
