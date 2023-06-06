import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvR6K0Nm6Dp262TSivEDgmgaw-9flCDTw",
  authDomain: "sistemaadvocacia-97747.firebaseapp.com",
  projectId: "sistemaadvocacia-97747",
  storageBucket: "sistemaadvocacia-97747.appspot.com",
  messagingSenderId: "388798885396",
  appId: "1:388798885396:web:d3cf83711df03d5acf4101",
  measurementId: "G-QD94DRL5TX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const FirestoreCrud = () => {
  const [items, setItems] = useState([]);
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const snapshot = await db.collection('funcionários').get();
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  };

  const addItem = async () => {
    try {
      await db.collection('funcionários').add({
        nome,
        cargo,
      });
      setNome('');
      setCargo('');
      fetchItems();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await db.collection('funcionários').doc(id).delete();
      fetchItems();
    } catch (error) {
      console.error('Erro ao deletar item:', error);
    }
  };

  const editItem = (item) => {
    setEditingItem(item);
    setNome(item.nome);
    setCargo(item.cargo);
  };

  const updateItem = async () => {
    try {
      await db.collection('funcionários').doc(editingItem.id).update({
        nome,
        cargo,
      });
      setNome('');
      setCargo('');
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    }
  };

  return (
    <div>
      <h2>Funcionários</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {editingItem && editingItem.id === item.id ? (
              <div>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                <input
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                />
                <button onClick={updateItem}>Salvar</button>
              </div>
            ) : (
              <div>
                <strong>{item.nome}</strong> - {item.cargo}
                <button onClick={() => editItem(item)}>Editar</button>
                <button onClick={() => deleteItem(item.id)}>Excluir</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {!editingItem && (
        <div>
          <h2>Adicionar Funcionário</h2>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="Cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />
          <button onClick={addItem}>Adicionar</button>
        </div>
      )}
    </div>
  );
};

export default FirestoreCrud;
