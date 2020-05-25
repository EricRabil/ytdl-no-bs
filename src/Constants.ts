import path from "path";

export const PORT = +process.env.PORT! || 6208;
export const HOSTNAME = process.env.HOSTNAME;
export const BACKLOG = +process.env.BACKLOG! || undefined;
export const VIEWS_DIR = process.env.VIEWS_DIR || path.resolve(__dirname, "..", "views");
export const DEBUG = !!process.env.DEBUG;