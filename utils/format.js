function formatScore(value){ return Number(Number(value).toFixed(2)); }
function getPagination(query){
 const page=Math.max(Number(query.page)||1,1);
 const limit=Math.min(Math.max(Number(query.limit)||20,1),100);
 return {page,limit,offset:(page-1)*limit};
}
module.exports={formatScore,getPagination};
