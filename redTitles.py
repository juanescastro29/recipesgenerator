import numpy as np
import tensorflow as tf
import pandas as pd
import pickle
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences


data = pd.read_csv("dataITE.csv")

ingredientes = data['ingredients'].tolist()
titles = data['title'].tolist()

for i, titulo in enumerate(titles):
    if not isinstance(titulo, str):
        titles[i] = str(titulo)


tokenizer_ingredientes = Tokenizer()
tokenizer_ingredientes.fit_on_texts(ingredientes)
total_words_ingredientes = len(tokenizer_ingredientes.word_index) + 1

tokenizer_titulos = Tokenizer()
tokenizer_titulos.fit_on_texts(titles)
total_words_recetas = len(tokenizer_titulos.word_index) + 1

total_words = len(tokenizer_ingredientes.word_index) + len(tokenizer_titulos.word_index)


input_sequences = []
for ingredient in ingredientes:
    token_list = tokenizer_ingredientes.texts_to_sequences([ingredient])[0]
    for i in range(1, len(token_list)):
        n_gram_sequence = token_list[:i + 1]
        input_sequences.append(n_gram_sequence)

output_sequences = []
for title in titles:
    token_list = tokenizer_titulos.texts_to_sequences([title])[0]
    for i in range(1, len(token_list)):
        n_gram_sequence = token_list[:i + 1]
        output_sequences.append(n_gram_sequence)


max_sequence_length = 25
input_sequences = np.array(pad_sequences(input_sequences, maxlen=max_sequence_length, padding='pre'))


X, y = input_sequences, output_sequences
y = tf.keras.utils.to_categorical(y, num_classes=total_words)


model = tf.keras.Sequential()
model.add(Embedding(total_words, 100, input_length=max_sequence_length))
model.add(LSTM(256, return_sequences=True))
model.add(Dropout(0.2)) 
model.add(LSTM(256))
model.add(Dropout(0.2))  
model.add(Dense(total_words, activation='softmax'))
model.compile(loss='categorical_crossentropy', optimizer='adam')


model.fit(X, y, epochs=100, verbose=1, batch_size=64)

model.summary()


with open('tokenizadorTitle.pkl', 'wb') as tokenizador_file:
    pickle.dump(tokenizer_titulos, tokenizador_file)

model.save("titles.h5")