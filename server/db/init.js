const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('./config')[process.env.NODE_ENV || "development"];

function init() {
  function createTableQuery(model) {
    let query = `CREATE TABLE IF NOT EXISTS \`${model.tableName}\` `;
    let queryAttribute = `(\`id\` INTEGER NOT NULL auto_increment`;

    for (const [key, value] of Object.entries(model.attributes)) {
      queryAttribute += `, \`${key}\``;
      value.forEach(type => {
        queryAttribute += ` ${type}`;
      })
    }
    queryAttribute += ', PRIMARY KEY (id)';
    if (model.associate) {
      for (const [key, value] of Object.entries(model.associate)) {
        queryAttribute += `, FOREIGN KEY (\`${key}\`) REFERENCES \`${value.ref}\` (\`${value.target}\`)`;
        queryAttribute += ' ON DELETE CASCADE ON UPDATE CASCADE'
      }
    }
    queryAttribute += ');';
    return query + queryAttribute;
  }
  // 1. models 폴더 내의 파일들 불러와서 모델 table 생성하기
  const pool = mysql.createPool(config);
  const models = [];
  const sortedModels = [];
  const sortedTableName = [];
  fs
  .readdirSync(__dirname + '/models')
  .forEach(file => {
    const model = require(path.join(__dirname+'/models', file));
    models.push(model);
  });
  while (models.length !== 0) {
    const model = models.shift();
    if (model.associate) {
      let nextFlag = true;
      for (const [_, value] of Object.entries(model.associate)) {
        const ref = value.ref;
        if (!sortedTableName.includes(ref)) {
          nextFlag = false;
          break;
        }
      }
      if (!nextFlag){
        models.push(model);
        continue;
      }
    }
    sortedModels.push(model);
    sortedTableName.push(model.tableName);
  }
  sortedModels.forEach(model => {
    const query = createTableQuery(model);
    
    pool.query(query)
    .then(() => {
      console.log('EXECUTE: ', query);
    })
    .catch(err => {
      console.error(err);
    })
  })
}
module.exports = init