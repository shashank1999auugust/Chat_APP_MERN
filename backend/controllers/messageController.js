import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";

export const sendMessage= async(req,res)=>{
    try {
        const senderId=req.id;
        const receiverId= req.params.id;
        const {message}=req.body
        //check whether the coversation between two participantsis already there or not
        let gotConversation= await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        })
        //if it is not there then create a conversation between them 
        if(!gotConversation){
          gotConversation =await Conversation.create({
            participants:[senderId, receiverId]
          })
        }
        //create a message 
        const newMessage= await Message.create({
            senderId,
            receiverId,
            message
        })
        //push this message to conversation model 
        if(newMessage){
            gotConversation.messages.push(newMessage._id)
        }

        await gotConversation.save()

        //SOCKET.IO later
        return res.status(201).json({
            message:"Message sent successfully"
        })
        
    } catch (error) {
        console.log(error)
    }
}


export const getMessage = async(req,res)=>{
    try {
        const receiverId= req.params.id
        const senderId=req.id
        const conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate("messages")
        // console.log(conversation.messages)
        return res.status(200).json(conversation?.messages)
    } catch (error) {
        console.log(error)
    }
}