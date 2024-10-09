/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("expenses", (table) => {
    table.string("expenseId", 36).primary();
    table.string("eventId", 36).nullable();
    table.text("description").nullable();
    table.decimal("amount", 10, 2).nullable();
    table.date("date").nullable();
    table.text("notes").nullable();
    table
      .timestamp("created_at")
      .defaultTo(knex.fn.now())
      .comment("Timestamp when the expense was created");
    table.string("userid", 36).notNullable();
    table.decimal("amount_paid", 10, 2).defaultTo(0.0).notNullable();
    table.decimal("amount_owed", 10, 2).defaultTo(0.0).notNullable();

    table.foreign("eventId").references("eventId").inTable("events");
    table
      .foreign("userid")
      .references("userid")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("expenses");
}
