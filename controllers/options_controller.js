const Option = require('../models/option');
const Question = require('../models/question');

// Delete an option
module.exports.deleteOption = async (req, res) => {
  try {
    const optionId = req.params.id;

    const option = await Option.findById(optionId);
    console.log('option',option);

    if (!option) {
      return res.status(400).json({
        message: 'option not found',
      });
    }
    console.log('option.votes',option.votes);
    // if option has atleast one vote it won't be deleted
    if (option.votes > 0) {
      return res.status(400).json({
        message: 'this option has atleast one vote',
      });
    }

    const question = await Question.findById(option.question);

    // remove reference of this option from question's options field
    await question.updateOne({ $pull: { options: optionId } });

    // delete the option
    await Option.findByIdAndDelete(optionId);

    return res.status(200).json({
      success: true,
      message: 'option deleted successfully!',
    });
  } catch (err) {
    console.log('*******', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// To increase the count of votes
module.exports.addVote = async (req, res) => {
  try {
    const optionId = req.params.id;

    const option = await Option.findById(optionId);

    if (!option) {
      return res.status(400).json({
        message: 'option not found',
      });
    }

    // add one to the value of votes of option
    option.votes += 1;

    option.save();

    // add one to the value of total votes of question
    const question = await Question.findById(option.question);
    question.totalVotes += 1;

    question.save();

    return res.status(200).json({
      success: true,
      option,
    });
  } catch (err) {
    console.log('*******', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
