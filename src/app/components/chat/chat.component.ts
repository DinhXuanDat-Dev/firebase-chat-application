import { Component, OnInit } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase, ref, set, onValue, remove, onChildChanged, DatabaseReference, onChildRemoved  } from "firebase/database";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Chat } from 'src/@core/interfaces/chat';
import { firebaseConfig } from 'src/environments/environment';
import { getDownloadURL, ref as storeRef, getStorage, uploadBytes, FirebaseStorage } from 'firebase/storage';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  app!: FirebaseApp;
  db!: Database;
  form!: FormGroup;
  username = '';
  message = '';
  chats: Chat[] = [];
  editingMessageId: string | any;
  chatsRef!: DatabaseReference;
  selectedFiles: File[] | null = [];
  storage: FirebaseStorage;
  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.app = initializeApp(firebaseConfig);
    this.storage = getStorage(this.app);
    this.db = getDatabase(this.app);
    this.form = this.formBuilder.group({
      'message' : ['', Validators.required],
      'username' : ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.chatsRef = ref(this.db, 'chats');
    this.listenData();
  }

  listenData() {
    onValue(this.chatsRef, (snapshot: any) => {
      const data = snapshot.val();
      if(!data) return;
      this.chats = Object.keys(data)?.map(key => ({ id: key, ...data[key] }));
    }, (error) => {
      console.error("Error fetching data:", error);
    });

    onChildChanged(this.chatsRef, (snapshot) => {
      const changedChat = snapshot.val();
      const chatIndex = this.chats.findIndex(chat => chat.id === snapshot.key);
      if (chatIndex !== -1) {
        this.chats[chatIndex] = { id: snapshot.key, ...changedChat };
      }
    }, (error) => {
      console.error("Error listening for child changes:", error);
    });

    onChildRemoved(this.chatsRef, (snapshot) => {
      const deletedChatId = snapshot.key;
      this.chats = this.chats.filter(chat => chat.id !== deletedChatId);
    });
  }

  async onChatSubmit(formValue: any) {
    const { username, message } = formValue;
    // Upload the image to Firebase Storage
    let imageUrl = '';
    let imageUrls = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file: File = this.selectedFiles[i];
        // Upload each file to Firebase Storage
        const storageRef = storeRef(this.storage, `images/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
        imageUrls.push(imageUrl);
      }
    }
   
    // Send the message including the image URL
    const chatMessage = {
      id: uuidv4(),
      username,
      message: message.trim(),
      imageUrls,
      timestamp: new Date().toString(),
    };

    set(ref(this.db, `chats/${chatMessage.id}`), chatMessage);

    this.form.reset();
    this.selectedFiles = null;
  }

  onDelete(chatId: string | undefined) {
    remove(ref(this.db, `chats/${chatId}`))
      .then(() => {
        this.chats = this.chats.filter(chat => chat.id !== chatId);
      })
      .catch(error => console.log(error));
  }

  onStartEdit(chatId: string | any) {
    this.editingMessageId = chatId;
  }

  onSaveEdit(chatId: string | any, updatedMessage: string) {
    const chatIndex = this.chats.findIndex(chat => chat.id === chatId);
    if (chatIndex !== -1) {
      const updatedChat = { ...this.chats[chatIndex], message: updatedMessage };
      set(ref(this.db, `chats/${chatId}`), updatedChat)
        .then(() => {
          this.chats[chatIndex] = updatedChat;
          this.editingMessageId = null;
        })
        .catch(error => console.log(error));
    }
  }

  onCancelEdit() {
    this.editingMessageId = null;
  }

  onFilesSelected(event: any) {
    this.selectedFiles = event.target.files;
  }

  trackByChatId(index: number, chat: Chat): string | undefined {
    return chat.id;
  }

}
