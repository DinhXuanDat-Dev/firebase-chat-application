import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.form.get('message')?.value).toEqual('');
    expect(component.form.get('username')?.value).toEqual('');
  });

  it('should mark form as invalid when fields are empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should mark form as valid when fields are filled', () => {
    component.form.patchValue({
      message: 'Test message',
      username: 'TestUser',
    });
    expect(component.form.valid).toBe(true);
  });

  it('should submit chat message', () => {
    spyOn(component, 'onChatSubmit').and.callThrough();
    component.form.patchValue({
      message: 'Test message',
      username: 'TestUser',
    });
    component.onChatSubmit(component.form.value);
    expect(component.onChatSubmit).toHaveBeenCalled();
    expect(component.chats.length).toBe(1); // Assuming successful submission adds a chat to the list
  });

  it('should delete chat message', () => {
    component.chats = [{ id: '1', username: 'TestUser', message: 'Test message', imageUrls: '', timestamp: new Date }];
    spyOn(component, 'onDelete').and.callThrough();
    component.onDelete('1');
    expect(component.onDelete).toHaveBeenCalled();
    expect(component.chats.length).toBe(0); // Assuming successful deletion removes the chat from the list
  });

  it('should start editing message', () => {
    const chatId = '1';
    component.onStartEdit(chatId);
    expect(component.editingMessageId).toEqual(chatId);
  });

  it('should save edited message', () => {
    const chatId = '1';
    const updatedMessage = 'Updated message';
    component.chats = [{ id: chatId, username: 'TestUser', message: 'Test message', imageUrls: '', timestamp: new Date }];
    spyOn(component, 'onSaveEdit').and.callThrough();
    component.onSaveEdit(chatId, updatedMessage);
    expect(component.onSaveEdit).toHaveBeenCalled();
    expect(component.chats.find(chat => chat.id === chatId)?.message).toEqual(updatedMessage);
  });

  it('should cancel editing message', () => {
    component.editingMessageId = '1';
    component.onCancelEdit();
    expect(component.editingMessageId).toBeNull();
  });
});
