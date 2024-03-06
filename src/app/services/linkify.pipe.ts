import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkify',
  standalone: true,
})
export class LinkifyPipe implements PipeTransform {
    transform(text: string): string {
        return text.replace(/(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig, (url: string) => {
            return `<a href="${url}" target="_blank" class="link-to-doc">Link zum Dokument!</a>`;
        });
    }
}