/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("events", (table) => {
    table.string("eventId", 36).primary();
    table.string("name", 255).notNullable();
    table.date("startDate").nullable();
    table.date("endDate").nullable();
    table.decimal("latitude", 9, 6).nullable();
    table.decimal("longitude", 9, 6).nullable();
    table.string("address", 255).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("events");
}
