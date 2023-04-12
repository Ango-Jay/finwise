import Dexie from "dexie";

export const db = new Dexie("finwise");

db.version(1).stores({
  users: "++uniqueId, firstname, lastname, email, password, image",
});
