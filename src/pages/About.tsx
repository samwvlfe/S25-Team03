interface Props {
    tNumber: number,
    vNumber: number,
    relDate: string,
    prodName: string,
    prodDesc: string,
}

export default function About({tNumber, vNumber, relDate, prodName, prodDesc}:Props) {
    return (
        <div>
            <h1>About Page Test</h1>
            <ul>
                <li>Team {tNumber}</li>
                <li>Version {vNumber}</li>
                <li>{relDate}</li>
                <li>{prodName}</li>
                <li>{prodDesc}</li>
            </ul>
        </div>
    )
}