import { version } from "../params/params.js";

export const health = async (req: any, res: any) => res.status(200)
  .json({
    status: "OK",
    version: version
  });

