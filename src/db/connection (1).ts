import mongoose from 'mongoose';

export class myDB{
    static DB: myDB = new myDB();
    DB_NAME = 'Game_DB';    // 
    URI = `mongodb://localhost:27017/${this.DB_NAME}`;

    async connectToDb(): Promise<void> {
        try {
            await mongoose.connect(this.URI);
            console.log('Connected to MongoDB (Mongoose)');
        } catch (err) {
            console.error('MongoDB connection error:', err);
        process.exit(1);
        }
    }

    static async getDB(): Promise<myDB>
    {
        if( mongoose.connection.readyState === 0)
            await this.DB.connectToDb();
        return this.DB;
    }
}
