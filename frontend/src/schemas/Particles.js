export const ParticlesParams = {
  particles: {
    number: {
      value: 180,
      density: {
        enable: true,
      },
    },
    size: {
      value: 3,
      random: {
        enable: true,
      },
      animation: {
        enable: true,
        speed: 4,
        size_min: 0.3,
      },
    },
    links: {
      enable: false,
    },
    move: {
      enable: true,
      random: true,
      speed: 1,
      direction: "bottom",
      outModes: {
        default: "out",
      },
    },
  },
};
