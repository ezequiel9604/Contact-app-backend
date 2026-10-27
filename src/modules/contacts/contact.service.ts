import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from './interfaces/contact';
import { contacts as dummyContacts } from './data/contacts';
import { normalizeString as nomarmalizeString } from '../../common/utils';

@Injectable()
export class ContactService {
  private contacts: Contact[] = [];
  private nextId = 1;

  constructor() {
    this.contacts = dummyContacts.map((c) => ({
      ...c,
      coordinates: { ...c.coordinates },
    }));
    this.nextId = Math.max(0, ...this.contacts.map((c) => c.id)) + 1;
  }

  findAll(): Contact[] {
    return this.contacts;
  }

  searchBy(filters: Partial<Omit<Contact, 'id'>>): Contact[] {
    if (Object.keys(filters).length === 0) {
      return this.contacts;
    }

    const name = nomarmalizeString(filters.name || '');

    return this.contacts.filter((contact) => {
      const contactName = nomarmalizeString(contact.name);
      const matchesName = name ? contactName.includes(name) : true;
      return matchesName;
    });
  }

  findOne(id: number): Contact {
    const contact = this.contacts.find((c) => c.id === id);
    if (!contact) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }
    return contact;
  }

  create(data: Omit<Contact, 'id'>): Contact {
    const contact: Contact = { id: this.nextId++, ...data };
    this.contacts.push(contact);
    return contact;
  }

  update(id: number, data: Partial<Omit<Contact, 'id'>>): Contact {
    const contact = this.findOne(id);
    Object.assign(contact, data);
    return contact;
  }

  remove(id: number): void {
    const contact = this.findOne(id);
    this.contacts = this.contacts.filter((c) => c.id !== contact.id);
  }
}
