const Poll = require('../models/Poll');

exports.createPollGetController = (req, res, next) => {
    res.render('create');
}

exports.createPollPostController = async (req, res, next) => {
    let { title, description, options } = req.body;
    console.log(req.body);
    options = options.map(opt => {
        return {
            name: opt,
            vote: 0
        }
    })
    let poll = new Poll({
        title, 
        description,
        options,
    });
    try {
        await poll.save()
        res.redirect('/polls')
    } catch (error) {
        console.log(error);
    }
}

exports.getAllPolls = async (req, res, next) => {
    try {
        let polls = await Poll.find()
        res.render('polls', {polls})
    } catch (error) {
        console.log(error);
    }
}

exports.viewPollGetController = async (req, res, next) => {
    const {id} = req.params;
    try {
        const poll = await Poll.findById(id);
        const options = [...poll.options];
        const result = [];
        options.forEach(option => {
            const percentage = (option.vote * 100) / poll.totalVote;
            result.push({
                ...option._doc,
                percentage: percentage ? percentage : 0
            })
        })
        res.render('viewPoll', {poll, result})
    } catch (error) {
        console.log(error)
    }
}

exports.viewPollPostController = async (req, res, next) => {
    const { id } = req.params;
    const optionId = req.body.option;
    try {
        const poll = await Poll.findById(id);
        const options = [...poll.options];
        const index = options.findIndex(o => o.id === optionId);
        options[index].vote += 1;
        const totalVote = poll.totalVote + 1;
        await Poll.findOneAndUpdate(
            {_id: poll._id},
            {$set: {options, totalVote}}
        )
        res.redirect('/polls/' +id);
    } catch (error) {
        console.log(error);
    }
}