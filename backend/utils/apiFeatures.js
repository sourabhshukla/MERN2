class ApiFeatures{
    constructor(query, queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword
         ? {
             name:{
                 $regex: this.queryStr.keyword,
                 $options: "i"
             }
         }
         : {};

         this.query = this.query.find({...keyword});
         return this;
         
    }

    filter(){
        //we don't do const queryCopy = this.queryStr; as in javascript objects are passed by reference
        //Hence any change in 'queryCopy' will also change this.queryStr;
        const queryCopy = {...this.queryStr};

        //Removing some fields for category
        const removeFields=["keyword","page","limit"];
        removeFields.forEach(key => delete queryCopy[key]);
        console.log(queryCopy);

        //Filter for Price and Rating
        let queryStr=JSON.stringify(queryCopy);
        //Add '$' in beginning of gt and lt
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key) => `$${key}`);

        this.query=this.query.find(JSON.parse(queryStr));
        console.log(queryStr);
        return this;
    }

    pagination(resultPerPage){
        //Default page is '1'
        const currentPage = Number(this.queryStr.page) || 1;
        //No. of items to be skipped on each page
        //eg: For 10 items per page we skip first 10 products for page 2.
        const skip = resultPerPage * (currentPage-1);
        this.query=this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports=ApiFeatures;