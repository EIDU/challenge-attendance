import { createApp } from "./app.js";
import { buildContainer } from "./container.js";

const PORT = Number(process.env.PORT ?? 4000);

const app = createApp(buildContainer());

app.listen(PORT, () => {
  console.log(`Attendance API listening on http://localhost:${PORT}`);
});
