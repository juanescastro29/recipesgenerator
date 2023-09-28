from flask import *
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import pickle
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
app = Flask(__name__)
cors = CORS(app)


@app.route("/generateTitle", methods=["POST"], strict_slashes=False)
def generateTitle():
    
    ingredients = request.get_json()
    
    model = tf.keras.models.load_model('titles.h5')

    # Tokenizar los ingredientes y recetas
    tokenizer = Tokenizer()
    with open('tokenizadorTitle.pkl', 'rb') as tokenizadorTitle:
        tokenizer = pickle.load(tokenizadorTitle)

    max_sequence_length = 20

    def generar_titulo(ingredientes_input, next_words, model, max_sequence_length):
        generated_title = []

        for _ in range(next_words):
            token_list = tokenizer.texts_to_sequences([ingredientes_input ])[0]
            token_list = pad_sequences([token_list], maxlen=max_sequence_length - 1, padding='pre')
            predicted = model.predict(token_list, verbose=0)

            predicted_word_index = np.argmax(predicted)
            predicted_word = None

            for word, index in tokenizer.word_index.items():
                if index == predicted_word_index:
                    predicted_word = word
                    break

            if predicted_word:
                generated_title.append(predicted_word)

        generated_title = " ".join(generated_title)
        return generated_title

    ingredients = ", ".join(ingredients)
    title = ingredients + " " + generar_titulo(ingredients, 6, model, max_sequence_length)
    
    return title 

@app.route("/generateRecipe", methods=["POST"], strict_slashes=False)
def generateRecipe():
    
    ingredients = request.get_json()

    model = tf.keras.models.load_model('recetas.h5')

    tokenizer = Tokenizer()
    with open('tokenizadorRecipes.pkl', 'rb') as tokenizadorRecipes:
        tokenizer = pickle.load(tokenizadorRecipes)

    max_sequence_length = 200

    def generar_receta(ingredientes_input, next_words, model, max_sequence_length):
        generated_recipe = []

        for _ in range(next_words):
            token_list = tokenizer.texts_to_sequences([ingredientes_input])[0]
            token_list = pad_sequences([token_list], maxlen=max_sequence_length - 1, padding='pre')
            predicted = model.predict(token_list, verbose=0)

            predicted_word_index = np.argmax(predicted)
            predicted_word = None

            for word, index in tokenizer.word_index.items():
                if index == predicted_word_index:
                    predicted_word = word
                    break

            if predicted_word:
                generated_recipe.append(predicted_word)

        generated_recipe = " ".join(generated_recipe)
        return generated_recipe

    ingredients = ", ".join(ingredients)
    receta = ingredients + " " + generar_receta(ingredients, 40, model, max_sequence_length)

    return receta

if __name__ == '__main__':
  app.run(ssl_context="adhoc")
  app.config['CORS_HEADERS'] = 'Content-Type'