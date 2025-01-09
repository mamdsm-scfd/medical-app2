require('./mongo');

const testSchema = new mongoose.Schema({
    name: String,
    age: Number,
});

const TestModel = mongoose.model('Test', testSchema);

const testDocument = new TestModel({ name: 'Test Name', age: 25 });

testDocument.save()
    .then(() => console.log('Document saved to MongoDB'))
    .catch((err) => console.error('Error saving document:', err));
