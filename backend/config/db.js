import mongoose from "mongoose"

export const conncectDB = async() =>{
  try {
    const conn =await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected ${conn.connection.host}`)
  } catch (error) {
    console.log(`connection error : ${error}`)
    process.exit()
  }
}