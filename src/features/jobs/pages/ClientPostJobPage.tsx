import PostJobCard from '../components/PostJobCard'
import PostJobForm from '../components/PostJobForm'

const ClientPostJobPage = () => {
  return (
    <PostJobCard    
      title="Post Kebutuhan Jasa"
      description="Lengkapi data berikut untuk mempublikasikan kebutuhan jasa Anda."
    >
      <PostJobForm />
    </PostJobCard>
  )
}

export default ClientPostJobPage