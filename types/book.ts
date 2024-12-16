export default interface Book {
  book_id: number,
  isbn10: number,
  title: string,
  subtitle: string,
  authors: string,
  categories: string,
  thumnail: string,
  description: string,
  published_year: number,
  average_rating: number,
  num_pages: number, 
  ratings_count: number
}