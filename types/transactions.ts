import type Book from "./book"

export default interface Transactions {
  transaction_id: number,
  book_id: number,
  member_id: number,
  issue_date: string,
  due_date: string,
  return_date: string,
  status: string,
  late_fee: string,
  days_late: number
}

export interface TransactionsWithBookData extends Transactions {
  BooksTable: Book
}