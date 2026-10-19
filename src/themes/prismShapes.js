export const prismShapes = ["blue", "pink", "green", "yellow"].map((tone, index) => ({
  tone,
  style: {
    "--index": index,
    "--shift": `${(index % 2 ? 1 : -1) * (15 + Math.random() * 15)}cqw`,
    "--skew-x": `${12 + Math.random() * 14}deg`,
    "--skew-y": `${Math.random() * 20 - 10}deg`,
    "--rotation": `${Math.random() * 40 - 20}deg`,
    "--scale-x": .5 + Math.random() * .5,
    "--scale-y": 1.5 + Math.random(),
    "--radius": index % 2 ? "50%" : "8%",
  },
}));
