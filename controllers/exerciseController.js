const exercises = require('../services/exercises');
const asyncHandler = require('../middlewares/asyncHandler');

const highPerformers = asyncHandler(async(req,res)=>
    res.json({
        success:true,
        data:await exercises.highPerformingStudents()
    })
);

const scoresBetween = asyncHandler(async(req,res)=>
    res.json({
        success:true,
        data:await exercises.scoresBetween()}
    )
);

const searchScores = asyncHandler(async(req,res)=>{
    const {keyword='',minScore=0}=req.query;
    res.json({
        success:true,
        data:await exercises.searchStudentsByNameAndScore(keyword,Number(minScore))
    });
});

const fullAcademicReport = asyncHandler(async(req,res)=>
    res.json({
        success:true,
        data:await exercises.fullAcademicReport()
    })
);

const averageScores = asyncHandler(async(req,res)=>
    res.json({
        success:true,
        data:await exercises.averageScorePerStudent()
    })
);

module.exports={highPerformers,scoresBetween,searchScores,fullAcademicReport,averageScores};
