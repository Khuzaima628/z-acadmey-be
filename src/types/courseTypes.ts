//  Course Types
export interface courseType {
    id?:string,
    title: string,
    description: string,
    slug: string,
    price: number,
    duration: string,
    course_time?: string,
    status?: string,
    level: string,
    category: string,
    rating: number,
    images?: string[],
    videos?: string[],
    instructor: string,
}
