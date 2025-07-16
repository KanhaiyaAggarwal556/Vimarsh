export default function Contact() {
    return (
        <div className="bg text-secondary px-4 py-5 text-center ContactUs">
            <div className="card-body text-center flex flex-column align-items-center justify-content-center">
                <h5 className="card-title">Contact Us</h5>
                <p className="card-text">
                    If you have any questions or feedback, please reach out to us at
                    <a href="mailto:kanhaiaggarwal@gmail.com">
                        <span className="badge text-bg-light">
                            kanhaiaggarwal@gmail.com
                        </span>
                    </a>
                </p>
            </div>
        </div>
    );
}