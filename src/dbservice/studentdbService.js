const studentSchema = require('../model/studentModel')

module.exports = {

    async checkExistance(params) {
        try {
            const result = await studentSchema.find(params).lean();
            return result;
        } catch (error) {
            return error
        }
    },

    async checkExistanceById(params) {
        try {
            console.log(params)
            const result = await studentSchema.findOne(params)
            return result;
        } catch (error) {
            return error
        }
    },

    async addStudent(params) {
        try {
            const studentInstance = new studentSchema(params);
            const result = await studentInstance.save()
            return result
        } catch (error) {
            return error
        }
    },

    async deleteStudents() {
        try {
            const result = await studentSchema.deleteMany({ "expiredAt": { $lte: Date.now() } })
            return result
        } catch (error) {
            return error
        }
    },

    async listStudents(params) {
        try {
            console.log("supplychain_db_service/SupplyChainList - start");

            let query = [];

            const allowedFilterArr = ["username", "createdAt", "expiredAt", "createdDate", "expiredDate"];
            const allowedSortArr = allowedFilterArr;
            if (params.global_search) {
                console.log("Global search");
                query.push({
                    $match: {
                        $or: allowedFilterArr.map(element => {
                            const filterObject = {
                                [element]: {
                                    '$regex': params.global_search,
                                    '$options': 'i'
                                }
                            };
                            return filterObject;
                        })
                    }
                });
            }
            else {
                console.log("Specific field search");
                if (params.filter && params.filter.length > 0) {
                    query.push({
                        $match: {
                            $and: params.filter.map(ele => {
                                if (!allowedFilterArr.includes(ele.id)) throw "Invalid Filter";
                                if (allowedFilterArr.includes(ele.id)) {
                                    return { [ele.id]: ele.value };
                                }
                                const filterObject = {
                                    [ele.id]: {
                                        $regex: ele.value,
                                        $options: 'i'
                                    }
                                };
                                return filterObject;
                            })
                        }
                    });
                }
            }

            if (params.sort && params.sort.length > 0) {
                if (params.sort.length > 1) throw "Invalid Sort";
                //if (!allowedSortArr.includes(params.sort[0].id)) throw "Invalid Sort";
                query.push({
                    $sort: {
                        [params.sort[0].id]: params.sort[0].value
                    }
                });
            } else {
                query.push({
                    $sort: { "username": 1 }
                });
            }

            query.push({
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    results: {
                        $push: {
                            "_id": "$_id",
                            "username": "$username",
                            "createdAt": "$createdAt",
                            "expiredAt": "$expiredAt"
                        }
                    }
                }
            });
            if (params.record_count && params.record_count > 0) {
                query.push({
                    $project: {
                        "_id": 0,
                        "total": "$total",
                        "result": {
                            $slice: ["$results", params.start_index, params.record_count]
                        }
                    }
                });
            } else {
                query.push({
                    $project: {
                        "_id": 0,
                        "total": "$total",
                        "result": "$results"
                    }
                });
            }
            console.log(`query :  ${JSON.stringify(query)}`);
            const result = await studentSchema.aggregate(query);
            console.log(result);
            return Promise.resolve(result);
        } catch (err) {
            console.logr(err);
            if (err.message) return Promise.reject(err.message);
            return Promise.reject(err);
        }
    }
}