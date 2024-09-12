// This is the High level JS runtime for Rive
// https://rive.app/community/doc/web-js/docvlgbnS1mp


// This code is based in this great tutorial about creating an Asteroids Game in JS: https://youtu.be/H9CSWMxJx84?si=5p89zuSm9WQOBJpQ

const riveInstance = new rive.Rive({
  src: "asteroids_ship.riv",
  canvas: document.getElementById("canvas"),
  autoplay: true,
  artboard: "Artboard",
  stateMachines: "State Machine 1",

  onLoad: () => {
    riveInstance.resizeDrawingSurfaceToCanvas();

    function main() {

      // SET UP //

      // inputs in the Rive File
      const inputs = riveInstance.stateMachineInputs("State Machine 1");
      let fireBoolean = inputs.find((i) => i.name === "Fire");
      let graphicsNumber = inputs.find((i) => i.name === "Graphics");


      const FRICTION = 0.76; // friction coefficient of space (0 = no friction, 1 = lots of friction)
      const SHIP_SIZE = 30; // ship height in pixels
      const SHIP_THRUST = 300; // acceleration of the ship 
      const SHIP_SPEEDLIMIT = 300; 
      const TURN_SPEED = 360; 


      const ARTBOARD_WIDTH = 500;
      const ARTBOARD_HEIGHT = 500;


      // set up the spaceship object
      const ship = riveInstance.artboard.node("Ship");

      ship.x = 250;
      ship.y =250;  
      ship.r = SHIP_SIZE / 2; // ship radius
      ship.a = (90 / 180) * Math.PI; // convert to radians // direction or angle
      ship.rot = 0;
      ship.thrusting = false;
      ship.thrust = { x: 0, y: 0 };

      // set up event handlers
      document.addEventListener("keydown", keyDown);
      document.addEventListener("keyup", keyUp);

      // set up keys
      function keyDown(ev) {
        
        switch (ev.keyCode) {
          case 40: // down arrow change graphics
          if (graphicsNumber.value == 0) {
            graphicsNumber.value = 2;
          } else if (graphicsNumber.value == 1) {
            graphicsNumber.value = 2;
          } else if (graphicsNumber.value == 2) {
            graphicsNumber.value = 1;
          }
  
          break;
          case 37: // left arrow (rotate ship left)
            ship.rot = (TURN_SPEED / 180) * Math.PI;
            break;
          case 38: // up arrow (thrust the ship forward)
            ship.thrusting = true;
            fireBoolean.value = true;
            break;
          case 39: // right arrow (rotate ship right)
            ship.rot = (-TURN_SPEED / 180) * Math.PI;
            break;
        }
      }

      function keyUp(ev) {
        switch (ev.keyCode) {
          case 37: // left arrow (stop rotating left)
            ship.rot = 0;
            break;
          case 38: // up arrow (stop thrusting)
            ship.thrusting = false;
            fireBoolean.value = false;
            break;
          case 39: // right arrow (stop rotating right)
            ship.rot = 0;
            break;
        }
      }

       // GAME LOOP //
      let lastTime = 0;

      function renderLoop(time) {
        if (!lastTime) {
          lastTime = time;
        }
        const elapsedTimeMs = time - lastTime;
        const elapsedTimeSec = elapsedTimeMs / 1000;
        lastTime = time;


        // thrust the ship
        if (ship.thrusting) {
          ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) * elapsedTimeSec;
          ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) * elapsedTimeSec;
          // Speed limit
          if (ship.thrust.x > SHIP_SPEEDLIMIT) {
            ship.thrust.x = SHIP_SPEEDLIMIT;
          }
          if (ship.thrust.x < -SHIP_SPEEDLIMIT) {
            ship.thrust.x = -SHIP_SPEEDLIMIT;
          }
          if (ship.thrust.y > SHIP_SPEEDLIMIT) {
            ship.thrust.y = SHIP_SPEEDLIMIT;
          }
          if (ship.thrust.y < -SHIP_SPEEDLIMIT) {
            ship.thrust.y = -SHIP_SPEEDLIMIT;
          }
        } else {
          // apply friction (slow the ship down when not thrusting)
          ship.thrust.x -= FRICTION * ship.thrust.x * elapsedTimeSec;
          ship.thrust.y -= FRICTION * ship.thrust.y * elapsedTimeSec;
        }

        // rotation of the ship
        ship.a += ship.rot * elapsedTimeSec;
        ship.rotation -= ship.rot * elapsedTimeSec;

        // move the ship
        ship.x += ship.thrust.x * elapsedTimeSec;
        ship.y += ship.thrust.y * elapsedTimeSec;

        // handle edge of screen
        if (ship.x < 0 - ship.r) {
          ship.x = ARTBOARD_WIDTH + ship.r;
        } else if (ship.x > ARTBOARD_WIDTH + ship.r) {
          ship.x = 0 - ship.r;
        }
        if (ship.y < 0 - ship.r) {
          ship.y = ARTBOARD_HEIGHT + ship.r;
        } else if (ship.y > ARTBOARD_HEIGHT + ship.r) {
          ship.y = 0 - ship.r;
        }

        window.requestAnimationFrame(renderLoop);
      }
      window.requestAnimationFrame(renderLoop);
    }

    main();
  },
});
