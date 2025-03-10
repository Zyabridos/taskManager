import request from "./request.js";

export function checkResponseCode(app, cookie, entity, path) {
  it(`should return new ${entity} creation page`, async () => {
    const response = await request(app, "GET", path, cookie);
    expect(response.statusCode).toBe(200);
  });
}

export async function findEntity(model, fieldName, value) {
  return model.query().findOne({ [fieldName]: value });
}
