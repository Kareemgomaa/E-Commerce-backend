import mongoose from "mongoose";

const dataBaseConnection = () => {
    return mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Data base connected successfully");
        })
        .catch((err) => {
            console.error("MongoDB Connection Error: ", err.message);
        });
};
export default dataBaseConnection;
