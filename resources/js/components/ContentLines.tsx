import { Fragment } from 'react';

export default function ContentLines({ text }: { text: string }) {
    return <>{text.split('\n').map((line, index) => <Fragment key={index}>{index > 0 && <br />}{line}</Fragment>)}</>;
}
