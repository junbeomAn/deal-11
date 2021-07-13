module.exports = {
  tableName: "Users",
  attributes: {
    username: [
      "VARCHAR(20)",
      "NOT NULL",
      "UNIQUE",
    ],
    location_one: [
      "VARCHAR(100)",
      "NOT NULL",
    ],
    location_two: [
      "VARCHAR(100)",
    ]
  }
}