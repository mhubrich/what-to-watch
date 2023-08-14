const fs = require("fs");
const Database = require("./database");
const RecordList = require("../utils/recordlist");


class FileDatabase extends Database {
    constructor(path) {
        super();
        this.path = path;
    }

    write(recordList) {
        fs.writeFileSync(this.path, RecordList.toJSON(recordList), "utf8");
    }
    
    getAll() {
        if (fs.existsSync(this.path)) {
            return RecordList.fromJSON(fs.readFileSync(this.path, "utf8"));
        }
        return new RecordList();
    }

    add(record) {
        const recordList = this.getAll();
        recordList.add(record);
        this.write(recordList);
        return recordList;
    }

    remove(id) {
        const recordList = this.getAll();
        let i = 0;
        while (i < recordList.length()) {
            if (recordList.get(i).meta.id == id) {
                recordList.remove(i);
            } else {
                i++;
            }
        }
        this.write(recordList);
        return recordList;
    }
}


module.exports = FileDatabase;