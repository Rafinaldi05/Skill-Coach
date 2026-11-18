import { app, prisma } from "./app.js";
import { env } from "./config.js";
import PgBoss from "pg-boss";
const boss = new PgBoss(env.DATABASE_URL);
await boss.start();
app.listen(env.PORT, () => console.log(`Skill Coach API listening on ${env.PORT}`));
const shutdown = async () => {
  await boss.stop();
  await prisma.$disconnect();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
