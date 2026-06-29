import {AuditEvent} from "../types/event.types"


interface ValidationError {
    field: string;
    message: string;
    code: string;
}

export function validateCreateEvent(data: Partial<AuditEvent>): ValidationError[] {
const errors: ValidationError[] = [];


if(!data.actor_id){
    errors.push({
        field: "actor_id",
        message: "actor_id is required.",
        code: "MISSING_ FIELD",
    });
}
 if(!data.action){
    errors.push({
        field: "action",
        message: "action is required",
        code: "MISSING_FIELD",
    });
 }
 if(!data.resource_type){
    errors.push({
        field: "resource_type",
        message: "resource_type is required",
        code: "MISSING_FIELD",
    });
 }
if(!data.resource_id){
    errors.push({
        field: "resource_id",
        message: "resource_id is required",
        code: "MISSING_FIELD",
    });
}
if(data.actor_id && typeof data.actor_id !== "string"){
    errors.push({
        field: "actor_id",
        message: "actor_id must be a string",
        code: "INVALID_TYPE"
    });
}

if(data.action && typeof data.action !== "string"){
    errors.push({
        field: "action",
        message: "action must be a string",
        code: "INVALID_TYPE",
    });
}
if(data.resource_type && typeof data.resource_type !== "string"){
    errors.push({
        field: "resource_type",
        message: "resource_type must be a string",
        code: "INVALID_TYPE",
    })
}
if(data.resource_id && typeof data.resource_id !== "string"){
    errors.push({
        field: "resource_id",
        message: "resource_id must be a string",
        code: "INVALID_TYPE"
    })
}
return errors;

}