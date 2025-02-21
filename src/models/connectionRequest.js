const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // reference to user collection, build relation
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // reference to user collection, build relation

    },

    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", 'rejected', "accepted"],
            message: ` {VALUE} Incorrect status type`
        }
    },

},
    {
        timestamps: true
    }
)

// compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

// Schema Validation
connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;

    //validation check for A --> A
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error('Connection Request not allowed for same user')
    }
    next()
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;