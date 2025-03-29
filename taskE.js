var express = require('express'); 
var router = express.Router();

router.get('/:city', function(req,res){
    const {partial, alpha, region, sort} = req.query;
    var city = req.params.city;
    query ={'ASCII Name': city};

    if(partial=='true'){
        query['ASCII Name'] = {$regex: `^.*${city}.*`}; 
    }


    if(alpha){
        query['ISO Alpha-2'] = alpha;
    }
    else if(region){
        query['Timezone'] = { $regex: `^${region}/.*` };
    }
    else{
        console.log('no a and r');
    }

    sortQuery={};
    if(sort){
        if(sort=='population'){
            sortQuery['Population'] = -1;
        }
        else if(sort=='alpha'){
            sortQuery['ISO Alpha-2'] = 1;
        }
        else{
            sortQuery['_id'] = 1
        }
    }
    else{
        sortQuery['_id'] = 1
    }
    //console.log('p'+ p);
    //console.log('a'+ a);
    //console.log('r'+ r);
    //console.log('s'+ s);
    //console.log('q1'+ JSON.stringify(query));
    console.log('q2'+ JSON.stringify(sortQuery));
    
    



    req.bigcities.find(query,{ _id: 1, 'ASCII Name': 1, 'ISO Alpha-2': 1, 'ISO Name EN': 1, Population: 1, Timezone: 1, Coordinates:1}).sort(sortQuery)
     .then(result =>{
        var docs = JSON.parse(JSON.stringify(result));
        console.log(docs);
        if(docs.length != 0){
            var obj = reconstruct(docs);
            res.status(200).json(obj);
        }
        else{
            var errMsg ={"error":"No record for this city name"};
            res.status(404).send(JSON.stringify(errMsg));
        }
     }
     ).catch(err =>{
        var errMsg = {'error': err.message};
        res.status(500);
        res.send(JSON.stringify(errMsg));
    });

})



function reconstruct(docs){
    for (i in docs){
        var doc = docs[i];
        const [x, y] = doc.Coordinates.split(',');
        var coords = {
            lat: parseFloat(x.trim()),
            lng: parseFloat(y.trim()),
        }
        delete doc.Coordinates;
        doc.Coordinates = coords;
    } 
    return docs;
}




module.exports = router;