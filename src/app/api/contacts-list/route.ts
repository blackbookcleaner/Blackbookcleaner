import { findContacts } from '@/lib/data'
import { FlattenContact } from '@/lib/definitions'
import { NextResponse } from 'next/server'
import { phone } from 'phone'

export async function GET(req: Request) {
  const contacts = await findContacts(1) // dummy search

  const responseContacts: FlattenContact[] = contacts.map((contact) => ({
    id: contact.id.toString(),
    userId: contact.userId.toString(),
    name: contact.name,
    nickName: contact.nickName,
    organizations: contact.organizations.map((item) => ({
      ...item.organization,
    })),
    phoneNumbers: contact.phoneNumbers.map((item) => {
      let phoneProcesed = phone(item.phoneNumber.number)
      return {
        ...phoneProcesed,
        ...item.phoneNumber,
      }
    }),
    occupations: contact.occupations.map((item) => ({ ...item.ocuppation })),
    photos: contact.photos.map((item) => ({ ...item.photo })),
    addresses: contact.addresses.map((item) => ({ ...item.address })),
    emails: contact.emails.map((item) => ({ ...item.email })),
    // location: contact.location ? contact.location : {contact.phoneNumbers[0].countryIso2 ? contact.phoneNumbers[0].countryIso2 : null}
    location:
      contact.phoneNumbers[0] &&
      phone(contact.phoneNumbers[0].phoneNumber.number) &&
      phone(contact.phoneNumbers[0].phoneNumber.number).countryIso2
        ? phone(contact.phoneNumbers[0].phoneNumber.number).countryIso2
        : null,
    source: contact.googleContacts.length > 0 ? "google" : "custom"

  }))

  return NextResponse.json(responseContacts)
}

export async function POST(req: Request) {
  const body = await req.json()
}

export async function PUT(req: Request) {
  const body = await req.json()
}

export async function DELETE(req: Request) {
  const body = await req.json()
}
