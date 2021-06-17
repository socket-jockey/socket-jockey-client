import Matter from 'matter-js';
import * as Tone from 'tone';
try {
  if (typeof MatterWrap !== 'undefined') {
    // either use by name from plugin registry (Browser global)
    Matter.use('matter-wrap');
  } else {
    // or require and use the plugin directly (Node.js, Webpack etc.)
    Matter.use(require('matter-wrap'));
  }
} catch (e) {
  // could not require the plugin or install needed
}
const Bodies = Matter.Bodies;
const Body = Matter.Body;

export const addBody = ({
  shape,
  isStatic,
  size,
  material,
  doesLoop,
  loopSize,
  speed,
  mouseX,
  mouseY,
  canvasX,
  canvasY,
  gainRef,
}) => {
  let body;
  const bodySize = size * -3 + 5;
  if (shape === 'CIRCLE') {
    body = Bodies.circle(mouseX, mouseY, bodySize);
  } else if (shape === 'SQUARE') {
    body = Bodies.rectangle(mouseX, mouseY, bodySize, bodySize);
  } else if (shape === 'HEXAGON') {
    body = Bodies.polygon(mouseX, mouseY, 6, bodySize);
  } else if (shape === 'WALL') {
    body = Bodies.rectangle(mouseX, mouseY, bodySize / 4, bodySize * 10);
  } else if (shape === 'FLOOR') {
    body = body = Bodies.rectangle(mouseX, mouseY, bodySize * 10, bodySize / 4);
  } else if (shape === 'TRIANGLE') {
    body = Bodies.polygon(mouseX, mouseY, 3, bodySize);
  } else if (shape === 'CHICHI') {
    body = Bodies.polygon(mouseX, mouseY, 3, bodySize);
  } else if (shape === 'CLOUD') {
    body = Bodies.rectangle(mouseX, mouseY, bodySize * 2, bodySize, {
      isSensor: true,
      render: {
        visible: true,
        sprite: {
          texture:
            'https://static.vecteezy.com/system/resources/previews/001/192/683/original/cloud-png.png',
          xScale: 0.03 * (bodySize / 10),
          yScale: 0.03 * (bodySize / 10),
        },
        // opacity: 0.7
      },
    });
    body.cloud = true;
    body.isSounding = false;
  }

  body.pitch = size + 27;

  let amp;
  switch (material) {
    case 'WOOD':
      Body.set(body, {
        restitution: 0.6,
        density: 0.005,
        frictionAir: 0.03 + size / -3000,
        render: {
          visible: true,
          opacity: 0.7,
          fillStyle: '#FFBA7A',
          strokeStyle: '#FFBA7A',
          lineWidth: 5,
        },
      });
      amp = new Tone.AmplitudeEnvelope({
        attack: 0.1,
        decay: 0.2,
        sustain: 0,
        release: 0.4,
        decayCurve: 'exponential'
      });
      body.synth = new Tone.MembraneSynth({
        envelope: amp,
        octaves: 1,
      }).connect(gainRef.current);

      break;
    case 'METAL':
      Body.set(body, {
        restitution: 0.3,
        density: 0.01,
        frictionAir: 0.01 + size / -5000,
        render: {
          visible: true,
          opacity: 0.7,
          fillStyle: '#D4BEEE',
          strokeStyle: '#D4BEEE',
          lineWidth: 5,
        },
        
      });
      body.synth = new Tone.MetalSynth().connect(gainRef.current);
      break;
    case 'RUBBER':
      Body.set(body, {
        restitution: 1.5,
        density: 0.005,
        frictionAir: speed,
        render: {
          visible: true,
          opacity: 0.7,
          fillStyle: '#FB998E',
          strokeStyle: '#FB998E',
          lineWidth: 5,
        },
      });
      body.synth = new Tone.FMSynth().connect(gainRef.current);
      break;
    case 'CLOTH':
      Body.set(body, {
        restitution: 0.001,
        density: 0.001,
        frictionAir: speed,
        render: {
          visible: true,
          opacity: 0.8,
          fillStyle: '#FFCAD8',
          strokeStyle: '#FFCAD8',
          lineWidth: 5,
        },
      });
      body.synth = new Tone.AMSynth().connect(gainRef.current);
      break;
    case 'BUBBLE':
      Body.set(body, {
        restitution: 0,
        density: 0.000001,
        frictionAir: speed * 2,
        render: {
          visible: true,
          opacity: 0.7,
          fillStyle: 'transparent',
          strokeStyle: '#95f9ddff',
          lineWidth: 5,
        },
      });
      body.bubble = true;
      body.synth = new Tone.PluckSynth().connect(gainRef.current);
      break;
    case 'GLITTER':
      Body.set(body, {
        restitution: 0,
        density: 0.001,
        frictionAir: 1,
        render: {
          visible: true,
          opacity: 0.8,
          fillStyle: '#FFBA7A',
          strokeStyle: '#FFBA7A',
          lineWidth: 5,
        },
      });
      body.synth = new Tone.Synth().connect(gainRef.current);
      break;
    case 'LIQUID':
      Body.set(body, {
        restitution: 0,
        density: 0.001,
        frictionAir: 1,
        render: {
          visible: true,
          opacity: 0.5,
          fillStyle: '#A3E5FF',
          strokeStyle: '#A3E5FF',
          lineWidth: 5,
        },
      });
      body.synth = new Tone.Synth().connect(gainRef.current);
      break;
    default:
      Body.set(body, {
        restitution: 1,
        density: 0.003,
        frictionAir: speed * 5,
      });
  }
  body.synth.silent = true;
  if (isStatic) Body.setStatic(body, isStatic);
  if (shape === 'CLOUD') {
    Body.setStatic(body, true);
  }
  if (doesLoop) {
    Body.set(body, {
      plugin: {
        wrap: {
          min: {
            x: mouseX,
            y: mouseY,
          },
          max: {
            x: mouseY + loopSize,
            y: mouseY + loopSize,
          },
        },
      },
    });
  } else {
    Body.set(body, {
      plugin: {
        wrap: {
          min: {
            x: 0,
            y: 0,
          },
          max: {
            x: canvasX,
            y: canvasY,
          },
        },
      },
    });
  }
  return body;
};
