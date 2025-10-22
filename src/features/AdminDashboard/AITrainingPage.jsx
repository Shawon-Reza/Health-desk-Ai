import React from 'react'
import AITrainingCenter from './AITrainingCenter'
import UploadedDocuments from './UploadedDocuments'

const AITrainingPage = () => {
    return (
        <div>
            <section className=''>
                <AITrainingCenter></AITrainingCenter>
            </section>


            {/* Uploaded Document 2nd part */}
            <section>
                <UploadedDocuments></UploadedDocuments>
            </section>

        </div>
    )
}

export default AITrainingPage