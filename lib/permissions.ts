import { adminAc, defaultStatements } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
    ...defaultStatements,
    event: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

export const user = ac.newRole({
    event: [],
});

export const organizer = ac.newRole({
    event: ["create", "update", "delete"],
});

export const admin = ac.newRole({
    event: ["create", "update", "delete"],
    ...adminAc.statements,
});