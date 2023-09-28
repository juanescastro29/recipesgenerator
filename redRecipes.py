import numpy as np
import tensorflow as tf
import pandas as pd
import pickle
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

data = pd.read_csv("dataITE.csv")

ingredientes = data['ingredients'].tolist()
recetas = data['steps'].tolist()

for i, ingrediente in enumerate(ingredientes):
    if not isinstance(ingrediente, str):
        ingredientes[i] = str(ingrediente)

tokenizer_ingredientes = Tokenizer()
tokenizer_ingredientes.fit_on_texts(ingredientes)
total_words_ingredientes = len(tokenizer_ingredientes.word_index) + 1

tokenizer_recetas = Tokenizer()
tokenizer_recetas.fit_on_texts(recetas)
total_words_recetas = len(tokenizer_recetas.word_index) + 1

total_words = len(tokenizer_ingredientes.word_index) + len(tokenizer_recetas.word_index)

input_sequences = []
for ingrediente in ingredientes:
    token_list = tokenizer_ingredientes.texts_to_sequences([ingrediente])[0]
    for i in range(1, len(token_list)):
        n_gram_sequence = token_list[:i + 1]
        input_sequences.append(n_gram_sequence)

output_sequences = []
for receta in recetas:
    token_list = tokenizer_recetas.texts_to_sequences([receta])[0]
    for i in range(1, len(token_list)):
        n_gram_sequence = token_list[:i + 1]
        output_sequences.append(n_gram_sequence)

max_sequence_length = 70
input_sequences = np.array(pad_sequences(input_sequences, maxlen=max_sequence_length, padding='pre'))
output_sequences = np.array(pad_sequences(output_sequences, maxlen=max_sequence_length, padding='pre'))

X, y = input_sequences, output_sequences
y = tf.keras.utils.to_categorical(y, num_classes=total_words)

model = tf.keras.Sequential()
model.add(Embedding(total_words_recetas, 100, input_length=max_sequence_length))
model.add(LSTM(256, return_sequences=True))
model.add(Dropout(0.2))  
model.add(LSTM(256))
model.add(Dropout(0.2))  
model.add(Dense(total_words_recetas, activation='softmax'))
model.compile(loss='categorical_crossentropy', optimizer='adam')

model.fit(X, y, epochs=50, verbose=1, batch_size=64)

model.summary()

with open('tokenizadorRecipes.pkl', 'wb') as tokenizador_file:
    pickle.dump(tokenizer_recetas, tokenizador_file)

model.save("recetas.h5")